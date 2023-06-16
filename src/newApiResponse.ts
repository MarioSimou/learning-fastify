export const StatusOk = 200
export const StatusCreated = 201
export const StatusNoContent = 204
export const StatusBadRequest = 400
export const StatusUnauthorized = 401
export const StatusForbidden = 403
export const StatusNotFound = 404
export const StatusMethodNotAllowed = 405
export const StatusInternalServerError = 500

type SuccessfulStatusCode =
  | typeof StatusOk
  | typeof StatusCreated
  | typeof StatusNoContent
type ErrorStatusCode =
  | typeof StatusBadRequest
  | typeof StatusUnauthorized
  | typeof StatusForbidden
  | typeof StatusNotFound
  | typeof StatusMethodNotAllowed
  | typeof StatusInternalServerError

type StatusCode = SuccessfulStatusCode | ErrorStatusCode

type SuccessfulApiResponse<TData> = {
  success: true
  status: SuccessfulStatusCode
  data: TData
}
type ErrorApiResponse = {
  success: false
  status: ErrorStatusCode
  message: string
}

type ApiResponse<TData> = SuccessfulApiResponse<TData> | ErrorApiResponse
type StringOrError = string | ErrorApiResponse

export const toError = (e: unknown): Error => {
  if (typeof e === 'string') {
    return new Error(e)
  }
  if (e instanceof Error) {
    return e
  }
  return new Error(JSON.stringify(e))
}

const isSuccessfulStatusCode = (
  statusCode: StatusCode
): statusCode is SuccessfulStatusCode => {
  return [StatusOk, StatusCreated, StatusNoContent].includes(statusCode)
}

const isErrorStatusCode = (
  statusCode: StatusCode
): statusCode is ErrorStatusCode => {
  return !isSuccessfulStatusCode(statusCode)
}

export function newApiResponse(
  statusCode: ErrorStatusCode,
  message: StringOrError
): ErrorApiResponse
export function newApiResponse<TData>(
  statusCode: SuccessfulStatusCode,
  data: TData
): SuccessfulApiResponse<TData>

export function newApiResponse<TData>(
  statusCode: StatusCode,
  data: StringOrError | TData
): ApiResponse<TData> {
  if (isErrorStatusCode(statusCode)) {
    return {
      status: statusCode,
      success: false,
      message: toError(data).message,
    }
  }

  if (isSuccessfulStatusCode(statusCode)) {
    return {
      status: statusCode,
      success: true,
      data: data as TData,
    }
  }

  throw new Error("Status code didn't match any of the checks")
}
