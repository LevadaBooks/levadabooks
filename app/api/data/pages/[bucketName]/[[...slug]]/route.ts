import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

if (!process.env.GOOGLE_STORAGE_PROJECT_ID) {
    throw new Error('GOOGLE_STORAGE_PROJECT_ID is not defined');
}

if (!process.env.GOOGLE_STORAGE_CLIENT_EMAIL) {
    throw new Error('GOOGLE_STORAGE_CLIENT_EMAIL is not defined');
}

if (!process.env.GOOGLE_STORAGE_PRIVATE_KEY) {
    throw new Error('GOOGLE_STORAGE_PRIVATE_KEY is not defined');
}

const storage = new Storage({
    projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }
});
const allowedContentTypes = ['application/json'];

const GET = async (request: NextRequest, context: RouteContext<'/api/data/pages/[bucketName]/[[...slug]]'>) => {
    const { bucketName, slug } = await context.params;
    const [lng, version] = slug!;

    try {
        const bucket = storage.bucket(bucketName);

        if (version) {
            const [file] = await bucket.file(`pages/${lng}/${version}/config.json`).getMetadata();
            const fileData = file.contentType && allowedContentTypes.includes(file.contentType) ? {
                name: file.name,
                size: file.size,
                uri: file.mediaLink,
                createdAt: file.timeCreated,
                updatedAt: file.updated
            } : {};

            return NextResponse.json(fileData, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            const prefix = `pages/${lng}/`;
            const [files] = await bucket.getFiles({ prefix });
            const filesData = files
                .map((file) => file.metadata)
                .filter((file) => file.contentType && allowedContentTypes.includes(file.contentType))
                .map((file) => ({
                    name: file.name,
                    size: file.size,
                    uri: file.mediaLink,
                    createdAt: file.timeCreated,
                    updatedAt: file.updated
                }));

            return NextResponse.json(filesData, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    } catch (error) {
        console.error('Error fetching files from Google Cloud Storage', error);
    }

    return NextResponse.json([], {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
};

export { GET };
