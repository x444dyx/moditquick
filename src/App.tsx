import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import ToolsDirectory from './pages/ToolsDirectory';
import Workspace from './pages/Workspace';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Tool Pages
import CompressImage from './pages/tools/CompressImage';
import JsonFormatter from './pages/tools/JsonFormatter';
import MergePdf from './pages/tools/MergePdf';
import ResizeImage from './pages/tools/ResizeImage';
import UrlEncoder from './pages/tools/UrlEncoder';
import Base64ToImage from './pages/tools/Base64ToImage';
import ColorPicker from './pages/tools/ColorPicker';
import PngToJpg from './pages/tools/PngToJpg';
import SplitPdf from './pages/tools/SplitPdf';
import ImageToBase64 from './pages/tools/ImageToBase64';
import DocxToPdf from './pages/tools/DocxToPdf';
import FaviconGenerator from './pages/tools/FaviconGenerator';
import JpgToPng from './pages/tools/JpgToPng';
import PngToWebp from './pages/tools/PngToWebp';

// New Tool Pages
import JpgToWebp from './pages/tools/JpgToWebp';
import WebpToJpg from './pages/tools/WebpToJpg';
import WebpToPng from './pages/tools/WebpToPng';
import PdfToImages from './pages/tools/PdfToImages';
import ImagesToPdf from './pages/tools/ImagesToPdf';
import RotatePdf from './pages/tools/RotatePdf';
import ReorderPdf from './pages/tools/ReorderPdf';
import CompressPdf from './pages/tools/CompressPdf';
import CropImage from './pages/tools/CropImage';
import RotateImage from './pages/tools/RotateImage';
import FlipImage from './pages/tools/FlipImage';
import SvgToPng from './pages/tools/SvgToPng';
import HeicToJpg from './pages/tools/HeicToJpg';
import JsonToCsv from './pages/tools/JsonToCsv';
import CsvToJson from './pages/tools/CsvToJson';
import HexToRgb from './pages/tools/HexToRgb';
import RgbToHex from './pages/tools/RgbToHex';
import SocialResizer from './pages/tools/SocialResizer';
import TextDiff from './pages/tools/TextDiff';
import LoremIpsum from './pages/tools/LoremIpsum';

// 22 New Tools
import OcrImageToText from './pages/tools/OcrImageToText';
import ScreenshotToPdf from './pages/tools/ScreenshotToPdf';
import QrGenerator from './pages/tools/QrGenerator';
import QrScanner from './pages/tools/QrScanner';
import BarcodeGenerator from './pages/tools/BarcodeGenerator';
import HashGenerator from './pages/tools/HashGenerator';
import UuidGenerator from './pages/tools/UuidGenerator';
import PasswordGenerator from './pages/tools/PasswordGenerator';
import JwtDecoder from './pages/tools/JwtDecoder';
import JwtEditor from './pages/tools/JwtEditor';
import UnixTimestamp from './pages/tools/UnixTimestamp';
import CronParser from './pages/tools/CronParser';
import DiffViewer from './pages/tools/DiffViewer';
import ApiTester from './pages/tools/ApiTester';
import CurlToFetch from './pages/tools/CurlToFetch';
import SqlFormatter from './pages/tools/SqlFormatter';
import JsonSchemaValidator from './pages/tools/JsonSchemaValidator';
import YamlJsonConverter from './pages/tools/YamlJsonConverter';
import SignatureMaker from './pages/tools/SignatureMaker';
import CaseConverter from './pages/tools/CaseConverter';
import SlugGenerator from './pages/tools/SlugGenerator';
import WordCounter from './pages/tools/WordCounter';

// Editor Tool Pages
import JavaScriptEditor from './pages/tools/JavaScriptEditor';
import TypeScriptEditor from './pages/tools/TypeScriptEditor';
import PythonEditor from './pages/tools/PythonEditor';
import HtmlEditor from './pages/tools/HtmlEditor';
import CssEditor from './pages/tools/CssEditor';
import JsonEditor from './pages/tools/JsonEditor';
import MarkdownEditor from './pages/tools/MarkdownEditor';
import YamlEditor from './pages/tools/YamlEditor';
import XmlEditor from './pages/tools/XmlEditor';
import SqlEditor from './pages/tools/SqlEditor';
import RegexTester from './pages/tools/RegexTester';
import IniEnvEditor from './pages/tools/IniEnvEditor';
import CsvEditor from './pages/tools/CsvEditor';
import MinifyBeautify from './pages/tools/MinifyBeautify';
import CodePlayground from './pages/tools/CodePlayground';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools" element={<ToolsDirectory />} />
            <Route path="/app" element={<Workspace />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Tool Routes */}
            <Route path="/tools/compress-image" element={<CompressImage />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            <Route path="/tools/resize-image" element={<ResizeImage />} />
            <Route path="/tools/url-encoder" element={<UrlEncoder />} />
            <Route path="/tools/base64-to-image" element={<Base64ToImage />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/png-to-jpg" element={<PngToJpg />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/tools/docx-to-pdf" element={<DocxToPdf />} />
            <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/tools/jpg-to-png" element={<JpgToPng />} />
            <Route path="/tools/png-to-webp" element={<PngToWebp />} />

            {/* New Tool Routes */}
            <Route path="/tools/jpg-to-webp" element={<JpgToWebp />} />
            <Route path="/tools/webp-to-jpg" element={<WebpToJpg />} />
            <Route path="/tools/webp-to-png" element={<WebpToPng />} />
            <Route path="/tools/pdf-to-images" element={<PdfToImages />} />
            <Route path="/tools/images-to-pdf" element={<ImagesToPdf />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/reorder-pdf" element={<ReorderPdf />} />
            <Route path="/tools/compress-pdf" element={<CompressPdf />} />
            <Route path="/tools/crop-image" element={<CropImage />} />
            <Route path="/tools/rotate-image" element={<RotateImage />} />
            <Route path="/tools/flip-image" element={<FlipImage />} />
            <Route path="/tools/svg-to-png" element={<SvgToPng />} />
            <Route path="/tools/heic-to-jpg" element={<HeicToJpg />} />
            <Route path="/tools/json-to-csv" element={<JsonToCsv />} />
            <Route path="/tools/csv-to-json" element={<CsvToJson />} />
            <Route path="/tools/hex-to-rgb" element={<HexToRgb />} />
            <Route path="/tools/rgb-to-hex" element={<RgbToHex />} />
            <Route path="/tools/social-resizer" element={<SocialResizer />} />
            <Route path="/tools/text-diff" element={<TextDiff />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />

            {/* 22 New Tool Routes */}
            <Route path="/tools/ocr" element={<OcrImageToText />} />
            <Route path="/tools/screenshot-to-pdf" element={<ScreenshotToPdf />} />
            <Route path="/tools/qr-generator" element={<QrGenerator />} />
            <Route path="/tools/qr-scanner" element={<QrScanner />} />
            <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/jwt-editor" element={<JwtEditor />} />
            <Route path="/tools/unix-timestamp" element={<UnixTimestamp />} />
            <Route path="/tools/cron-parser" element={<CronParser />} />
            <Route path="/tools/diff-viewer" element={<DiffViewer />} />
            <Route path="/tools/api-tester" element={<ApiTester />} />
            <Route path="/tools/curl-to-fetch" element={<CurlToFetch />} />
            <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
            <Route path="/tools/json-schema-validator" element={<JsonSchemaValidator />} />
            <Route path="/tools/yaml-json" element={<YamlJsonConverter />} />
            <Route path="/tools/signature-maker" element={<SignatureMaker />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/slug-generator" element={<SlugGenerator />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />

            {/* Editor Tool Routes */}
            <Route path="/tools/js-editor" element={<JavaScriptEditor />} />
            <Route path="/tools/ts-editor" element={<TypeScriptEditor />} />
            <Route path="/tools/python-editor" element={<PythonEditor />} />
            <Route path="/tools/html-editor" element={<HtmlEditor />} />
            <Route path="/tools/css-editor" element={<CssEditor />} />
            <Route path="/tools/json-editor" element={<JsonEditor />} />
            <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/tools/yaml-editor" element={<YamlEditor />} />
            <Route path="/tools/xml-editor" element={<XmlEditor />} />
            <Route path="/tools/sql-editor" element={<SqlEditor />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/ini-env-editor" element={<IniEnvEditor />} />
            <Route path="/tools/csv-editor" element={<CsvEditor />} />
            <Route path="/tools/minify-beautify" element={<MinifyBeautify />} />
            <Route path="/tools/code-playground" element={<CodePlayground />} />
            
            {/* Fallback for other tools to show the directory or a placeholder */}
            <Route path="/tools/*" element={<ToolsDirectory />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
