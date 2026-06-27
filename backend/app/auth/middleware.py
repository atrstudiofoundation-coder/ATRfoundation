from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from typing import Callable, Awaitable
from app.auth.jwt import verify_token
from app.auth.cookies import read_auth_cookie

class OptionalAuthMiddleware(BaseHTTPMiddleware):
    """
    Optional Authentication Middleware.
    Inspects incoming requests for JWT tokens (via Authorization header or Cookie),
    and attaches claims to request.state if valid. Does not block unauthenticated requests.
    """
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
        else:
            token = read_auth_cookie(request)
            
        request.state.user_claims = None
        if token:
            try:
                claims = verify_token(token)
                request.state.user_claims = claims
            except ValueError:
                pass  # Ignore invalid token for optional middleware parsing
                
        response = await call_next(request)
        return response
