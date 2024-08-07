#!/usr/bin/env node

import * as p from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import color from 'picocolors';
import shell from 'shelljs';
import path from 'node:path';
import fs from 'node:fs';

async function main() {
    const replicateTemplates = async (templatePath, projectPath) => {
        let templateFilesNames = fs.readdirSync(templatePath);

        const filesToBeSkipped = ['node_modules', 'build', 'dist'];
        templateFilesNames = templateFilesNames.filter(name => !filesToBeSkipped.includes(name));

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
        } else {
            p.cancel('Directory already exists');
            process.exit(1);
        }

        templateFilesNames.forEach(name => {
            const originPath = path.join(templatePath, name);
            const destinationPath = path.join(projectPath, name);
            const stats = fs.statSync(originPath);

            if (stats.isFile()) {
                const content = fs.readFileSync(originPath, 'utf8');
                fs.writeFileSync(destinationPath, content);
            } else if (stats.isDirectory()) {
                replicateTemplates(originPath, destinationPath);
            }
        });
    };

    console.clear();

    await setTimeout(1000);

    p.intro(`${color.bgCyan(color.black(' create-bikinproject-app '))}`);

    const project = await p.group(
        {
            path: () =>
                p.text({
                    message: 'Where should we create your project?',
                    placeholder: './next-template',
                    validate: (value) => {
                        if (!value) return 'Please enter a path.';
                        if (value[0] !== '.') return 'Please enter a relative path.';
                    },
                }),
            type: ({ results }) =>
                p.select({
                    message: `Pick a project type within "${results.path}"`,
                    initialValue: 'next-ts-template',
                    maxItems: 5,
                    options: [
                        { value: 'next-ts-template', label: 'Next.js App Router (Tailwind + TypeScript)' },
                        { value: 'next-js-template', label: 'Next.js App Router (Tailwind + JavaScript)' },
                    ],
                }),
            install: () =>
                p.confirm({
                    message: 'Install dependencies?',
                    initialValue: false,
                }),
        },
        {
            onCancel: () => {
                p.cancel('Operation cancelled.');
                process.exit(1);
            },
        }
    );

    if (project !== null || project !== undefined) {
        const s = p.spinner();
        const nextSteps = `cd ${project.path}        \n${project.install ? '' : 'npm install\n'}npm run dev`;
        const contact = `Have a Problems? Report to ${color.underline(color.cyan('naufalakbar378@gmail.com'))}`;

        s.start('⏳ Creating project...');
        await setTimeout(2500);

        const projectName = project.path;
        const projectTemplate = project.type;

        const projectPath = path.join(process.cwd(), projectName);
        const templatePath = path.join(process.cwd(), 'templates', projectTemplate);

        await replicateTemplates(templatePath, projectPath);

        if (project.install && fs.existsSync(path.join(projectPath, 'package.json'))) {
            s.start('📦 Installing dependencies...');
            await setTimeout(2500);

            shell.cd(projectPath);
            shell.exec('npm install --silent');

            s.stop('✅ Dependencies installed!');
            p.note(nextSteps, 'Next steps.');
            p.outro(contact);
            process.exit(1);
        }

        s.stop('🎉 Project Created!');
        p.note(nextSteps, 'Next steps.');
        p.outro(contact);
    }
}

main().catch(console.error);