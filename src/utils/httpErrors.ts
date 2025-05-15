import { NextResponse } from 'next/server';

export const badRequest = (error: string) =>
    NextResponse.json({ error }, { status: 400 });

export const unauthorized = (error: string) =>
    NextResponse.json({ error }, { status: 401 });

export const forbidden = (error: string) =>
    NextResponse.json({ error }, { status: 403 });

export const notFound = (error: string) =>
    NextResponse.json({ error }, { status: 404 });

export const methodNotAllowed = (error: string) =>
    NextResponse.json({ error }, { status: 405 });

export const conflict = (error: string) =>
    NextResponse.json({ error }, { status: 409 });

export const unprocessableEntity = (error: string) =>
    NextResponse.json({ error }, { status: 422 });

export const internalServerError = (error: string) =>
    NextResponse.json({ error }, { status: 500 });

export const notImplemented = (error: string) =>
    NextResponse.json({ error }, { status: 501 });

export const serviceUnavailable = (error: string) =>
    NextResponse.json({ error }, { status: 503 });
