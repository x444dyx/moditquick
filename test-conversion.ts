import { exec } from 'child_process';
import fs from 'fs';

const testFile = 'test.txt';
fs.writeFileSync(testFile, 'Hello World from LibreOffice Headless!');

const userProfile = '/tmp/libreoffice-user-profile';
if (!fs.existsSync(userProfile)) fs.mkdirSync(userProfile);

const command = `soffice "-env:UserInstallation=file://${userProfile}" --headless --convert-to pdf --outdir /tmp ${testFile}`;

console.log(`Running: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
  if (fs.existsSync('/tmp/test.pdf')) {
    console.log('Success! PDF generated.');
  } else {
    console.log('PDF not found in output directory.');
  }
});
