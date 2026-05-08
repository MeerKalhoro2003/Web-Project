const AuditLog = require('../models/AuditLog.js');

exports.createAuditLog = async ({
  admin,
  action,
  targetType,
  targetId,
}) => {
  await AuditLog.create({
    admin,
    action,
    targetType,
    targetId,
  });
};
