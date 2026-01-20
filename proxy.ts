import { NextResponse, NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName, headerName } from '@/locales/settings';

acceptLanguage.languages(languages);

export const config = {
    // matcher: '/:lng*'
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|assets|data|favicon.ico|sw.js|manifest.webmanifest|robots.txt|sitemap.xml).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'next-action' },
                { type: 'header', key: 'purpose', value: 'prefetch' }
            ]
        }
    ]
};

export function proxy(req: NextRequest) {
    let lng: string | undefined | null;
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'unsafe-eval' *.google.com;
        frame-src 'self' *.google.com;
        frame-ancestors 'self' *.google.com;
        connect-src 'self' *.google.com;
        style-src 'self' 'unsafe-inline';
        worker-src 'self' blob:;
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
    `;
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();
    /*
    if (req.nextUrl.pathname.endsWith('.html')) { // for static pages (Privacy Policy, Cookie Policy, Terms Of Use)
        return NextResponse.next();
    }
    */
    if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
        return NextResponse.next();
    }

    if (req.cookies.has(cookieName)) {
        lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
    }

    if (!lng) {
        lng = acceptLanguage.get(req.headers.get('Accept-Language'));
    }

    if (!lng) {
        lng = fallbackLng;
    }

    const lngInPath = languages.find((loc) => req.nextUrl.pathname.startsWith(`/${loc}`));
    const headers = new Headers(req.headers);

    headers.set(headerName, lngInPath || lng);
    headers.set('x-nonce', nonce); // https://nextjs.org/docs/app/guides/content-security-policy
    headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    headers.set('Content-Language', lngInPath || lng);

    // Redirect if lng in path is not supported
    try {
        if (!lngInPath && !req.nextUrl.pathname.startsWith('/_next')) {
            return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url));
        }
    } catch (error) {
        console.error('Failed to redirect if there is no language in URL path', error);
    }

    const response = NextResponse.next({ headers, request: { headers } }); // Otherwise Server Actions will not work

    if (req.headers.has('referer')) {
        const refererUrl = new URL(req.headers.get('referer') || '');
        const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));

        if (lngInReferer) {
            response.cookies.set(cookieName, lngInReferer);
        }
    }

    return response;
}

/*
https://stackoverflow.com/questions/78929839/useactionstate-use-in-next-server-actions
https://github.com/vercel/next.js/issues/50659
*/
