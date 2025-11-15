const { prisma } = require('../config/database');

// Ensure Prisma client is properly initialized
if (!prisma || !prisma.emailTemplate) {
  console.error('Prisma client not properly initialized. Please run: npx prisma generate');
}

/**
 * POST /api/email-templates - Create email template
 */
const createTemplate = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, category, description, subject, html, text, variables, isActive, isDefault } = req.body;

    // Validation
    if (!name || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Name, subject, and HTML content are required',
      });
    }

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // If setting as default, unset other defaults in same category
    if (isDefault && category) {
      await prisma.emailTemplate.updateMany({
        where: {
          ...(userId ? { userId } : { superAdminId }),
          category,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const template = await prisma.emailTemplate.create({
      data: {
        userId,
        superAdminId,
        name,
        category: category || null,
        description: description || null,
        subject,
        html,
        text: text || null,
        variables: variables || [],
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Template created successfully',
      data: template,
    });
  } catch (error) {
    console.error('Create template error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create template',
    });
  }
};

/**
 * PUT /api/email-templates/:id - Update email template
 */
const updateTemplate = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { name, category, description, subject, html, text, variables, isActive, isDefault } = req.body;

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // Check if template exists and belongs to user
    const existing = await prisma.emailTemplate.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    // If setting as default, unset other defaults in same category
    if (isDefault && (category || existing.category)) {
      await prisma.emailTemplate.updateMany({
        where: {
          ...(userId ? { userId } : { superAdminId }),
          category: category || existing.category,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category !== undefined && { category: category || null }),
        ...(description !== undefined && { description: description || null }),
        ...(subject && { subject }),
        ...(html && { html }),
        ...(text !== undefined && { text: text || null }),
        ...(variables && { variables }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template,
    });
  } catch (error) {
    console.error('Update template error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to update template',
    });
  }
};

/**
 * GET /api/email-templates - Get all templates
 */
const getTemplates = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { category, isActive } = req.query;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const where = {
      ...(userId ? { userId } : { superAdminId }),
      ...(category && { category }),
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
    };

    const templates = await prisma.emailTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to get templates',
    });
  }
};

/**
 * GET /api/email-templates/:id - Get single template
 */
const getTemplate = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Get template error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to get template',
    });
  }
};

/**
 * DELETE /api/email-templates/:id - Delete template
 */
const deleteTemplate = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    await prisma.emailTemplate.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Delete template error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to delete template',
    });
  }
};

module.exports = {
  createTemplate,
  updateTemplate,
  getTemplates,
  getTemplate,
  deleteTemplate,
};

