"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openRouter = void 0;
// routes/open/index.ts
const express_1 = require("express");
const tvShowRoutes_1 = require("./tvShowRoutes");
exports.openRouter = (0, express_1.Router)();
exports.openRouter.use(tvShowRoutes_1.tvShowRoutes);
exports.openRouter.use('/api', tvShowRoutes_1.tvShowRoutes);
