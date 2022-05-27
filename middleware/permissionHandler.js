const { catchAsync } = require('../utils/catchAsync');
const { checkPermission } = require('../helper/permission');
const { role } = require('../utils/constant');
const { sendMessage } = require('../helper/helpers');
const { statusCodes } = require('../utils/statusCodes');

const can = (group, resource) => {
  return async (req, res, next) => {
    if (req.user.role_id === role.ADMIN) {
      const checkpermission = await checkPermission(
        req.user.role_id,
        group,
        resource
      );
      if (!checkpermission)
        return sendMessage(
          { code: statusCodes.NON_AUTHORITATIVE_INFORMATION.code },
          statusCodes.NON_AUTHORITATIVE_INFORMATION.desc,
          statusCodes.NON_AUTHORITATIVE_INFORMATION.code,
          res
        );
    }
    next();
  };
};
module.exports = { can };
