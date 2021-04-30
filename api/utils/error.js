function ErrorHandler() {
    const errors = []

    let code = null

    const InvalidParameterCode = 400
    const ActionForbiddenCode = 403
    const UnauthorizedCode = 401
    const NotFoundCode = 404
    const InternalErrorCode = 500

    const InvalidParameter = (parameter, message = "") => {
        code = InvalidParameterCode
        errors.push({
            type: "invalid_parameter",
            parameter,
            message
        })
    }

    const NotFound = (message = "") => {
        code = NotFoundCode
        errors.push({
            type: "not_found",
            message
        })
    }

    const ActionForbidden = (message = "") => {
        code = ActionForbiddenCode
        errors.push({
            type: "action_forbidden",
            message
        })
    }

    const Unauthorized = (message = "") => {
        code = UnauthorizedCode
        errors.push({
            type: "unauthorized",
            message
        })
    }

    const InternalError = (message = "") => {
        code = InternalErrorCode
        errors.push({
            type: "internal_error",
            message
        })
    }

    const Has = () => {
        return errors.length > 0 ? true : false
    }

    const GetErrors = () => {
        return errors
    }

    const GetCode = () => {
        return code
    }

    return {
        InvalidParameter,
        NotFound,
        ActionForbidden,
        Unauthorized,
        InternalError,
        InvalidParameterCode,
        ActionForbiddenCode,
        UnauthorizedCode,
        NotFoundCode,
        InternalErrorCode,
        Has,
        GetErrors,
        GetCode,
    }
}

module.exports = ErrorHandler