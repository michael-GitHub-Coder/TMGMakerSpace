"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = __importStar(require("express"));
const path_1 = require("path");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const serialization_interceptor_1 = require("./interceptors/serialization.interceptor");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    ['uploads/marketplace', 'images', 'marketplace'].forEach(dir => {
        const fullPath = (0, path_1.join)(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Created directory: ${fullPath}`);
        }
    });
    app.use((req, res, next) => {
        if (req.headers['content-type']?.startsWith('multipart/form-data')) {
            return next();
        }
        express.json({ limit: '50mb' })(req, res, (err) => {
            if (err)
                return next(err);
            express.urlencoded({ limit: '50mb', extended: true })(req, res, next);
        });
    });
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.use('/uploads', express.static((0, path_1.join)(process.cwd(), 'uploads')));
    app.use('/marketplace', express.static((0, path_1.join)(process.cwd(), 'marketplace')));
    app.use('/images', express.static((0, path_1.join)(process.cwd(), 'images')));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new serialization_interceptor_1.SerializationInterceptor());
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Backend server running on http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`Static files served from: ${(0, path_1.join)(process.cwd(), 'uploads')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map