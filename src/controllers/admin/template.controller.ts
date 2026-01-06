import type { Request, Response } from "express";
import { TemplateSchema } from "../../models";


export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await TemplateSchema.create(req.body);

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllTemplates = async (_req: Request, res: Response) => {
  try {
    const templates = await TemplateSchema.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const template = await TemplateSchema.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const template = await TemplateSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: template
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await TemplateSchema.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Template deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
