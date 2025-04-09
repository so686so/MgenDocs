import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

// 파일 경로 변수로 관리
const htmlTitle        = 'MAIA 엔진 명세서'
const mdFilePath       = 'contents.md';
const cssFilePath      = 'style.css';
const templateFilePath = 'template.html';
const outputFilePath   = 'out/EngineProfileManual.html';

// Markdown 렌더링 설정
const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
  const id = text.text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
  return `<h${text.depth} id="${id}">${text.text}</h${text.depth}>`;
}
marked.setOptions({renderer});

// 파일 읽기
const md = fs.readFileSync(mdFilePath, 'utf-8');
const htmlBody = marked(md);

// CSS 읽기
const css = fs.readFileSync(cssFilePath, 'utf-8');
const cssInline = `<style>\n${css}\n</style>`;

// 템플릿 읽기
const template = fs.readFileSync(templateFilePath, 'utf-8');

// 최종 HTML 생성
const html = template
  .replace('%%TITLE%%', htmlTitle)
  .replace('%%STYLE%%', cssInline)
  .replace('%%BODY%%', htmlBody);

// ES 모듈에서 __dirname을 대체하는 코드
const __dirname = path.resolve();  // 절대 경로로 __dirname을 처리

// 경로가 잘못 설정되지 않도록 수정
const outputDir = path.join(__dirname, 'out');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// HTML 파일로 출력
fs.writeFileSync(outputFilePath, html);
console.log('✅ 문서 생성 완료!');
