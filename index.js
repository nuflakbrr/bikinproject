#!/usr/bin/env node

import * as p from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import color from 'picocolors';
import shell from 'shelljs';
import path from 'node:path';
import fs from 'node:fs';

async function main() {
    const __filename = fileURLToPath(import.meta.url);

    const replicateTemplates = async (templatePath, projectPath) => {
        let templateFilesNames = fs.readdirSync(templatePath);

        const filesToBeSkipped = ['node_modules', 'build', 'dist'];
        templateFilesNames = templateFilesNames.filter(name => !filesToBeSkipped.includes(name));

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
        }

        if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
            p.cancel('Directory is not empty! Please create a project in an empty directory.');
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
                    placeholder: './your-project',
                    validate: (value) => {
                        if (!value) return 'Please enter a path.';
                        if (value[0] !== '.') return 'Please enter a relative path.';
                    },
                }),
            type: ({ results }) =>
                p.select({
                    message: `Pick a starter project type within "${results.path}"`,
                    initialValue: 'react-ts-template',
                    options: [
                        { value: 'react-ts-template', label: 'React.js (Tailwind + TypeScript)' },
                        { value: 'react-js-template', label: 'React.js (Tailwind + JavaScript)' },
                        { value: 'next-ts-template', label: 'Next.js App Router (Tailwind + TypeScript)' },
                        { value: 'next-js-template', label: 'Next.js App Router (Tailwind + JavaScript)' },
                        { value: 'laranext-ts-template', label: 'Laravel Breeze API w/ Next.js App Router (Tailwind + TypeScript)' },
                    ],
                }),
            install: () =>
                p.confirm({
                    message: 'Install dependencies? (currently only NPM is supported)',
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
        const nextSteps = `cd ${project.path}        \n${project.install ? '' : 'npm install\n'}npm run dev\n\n${color.underline(color.cyan('Happy Coding!'))}`;
        const contact = `Have a Problems? Report to ${color.underline(color.cyan('https://github.com/nuflakbrr/bikinproject/issues'))}`;

        s.start('⏳ Creating project...');
        await setTimeout(2500);

        const projectName = project.path;
        const projectTemplate = project.type;

        const projectPath = path.join(process.cwd(), projectName);
        const templatePath = path.join(path.dirname(__filename), 'templates', projectTemplate);

        await replicateTemplates(templatePath, projectPath);

        if (project.install && fs.existsSync(path.join(projectPath, 'package.json'))) {
            s.stop('✅ Project created!');
            s.start('📦 Installing dependencies...');
            await setTimeout(2500);

            shell.cd(projectPath);
            shell.exec('npm install --silent');

            s.stop('✅ Dependencies installed!');
            p.log.step('🎉 Project ready to use!');
            p.note(nextSteps, 'Next steps.');
            p.outro(contact);
            process.exit(1);
        }

        s.stop('🎉 Project created!');
        p.note(nextSteps, 'Next steps.');
        p.outro(contact);
    }
}

main().catch(console.error);