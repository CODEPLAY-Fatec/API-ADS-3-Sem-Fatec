import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
//aqui sao as rotas q estao privadas, no caso se for criar mais paginas adicionar elas aqui
const protectedRoutes = ['/home', '/admin/dashboard', '/home/register','/home/funcionarios','/home/profile','/home/surveys/availablesurveys','/home/surveys/surveycrud','/home/teamregistration'];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const userToken = request.cookies.get('userToken')?.value;

  // Se o usuário não tiver nenhum dos tokens, redireciona para a página de login
  if (!authToken && !userToken && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  //se tiver token ele so continua
  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/admin/:path*'],
};
