import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";

export const upload:MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        console.log('Upload middlware')
        // if (!request.method || request.method !== 'POST') {
        //     // Not a POST request, skip middleware
        // }
        // let body = request.body;
        // console.log(body)
        // if (typeof body === 'string' && !(request.headers?.get('content-type') || '')
        //     .includes('multipart'))
        // try {
        //     body = JSON.parse(body);
        // } catch (_err) {}
        //     if ((!Array.isArray(body) || !(body as Array<any>).some((part)=> typeof part
        //         === 'object'
        //     ))&& request.headers?.get('content-disposition') == null) throw new Error("No multipart form data detected");
        return next(request, _next);
            
    // )) && request.headers?.get('content-disposition')){
    //     const parts = request.headers['content-disposition']!.split(';');
    //     if (parts[0]==='form-data'){
    //         const name = parts[1].trim().slice(2);
    //         body= [{[name]: body}];
    //         } else throw new Error(`Invalid content-disposition header for non-file data`);
    //         }   
    //         const files : Record<string, File | undefined> = {};
    //         if (Array.isArray(body)){
    //             for(const obj of body){
    //                 if (obj instanceof Object){
    //                     for(const key in obj){
    //                         if (/^file\d+$/.test(key)){
    //                             const fileId = parseInt(/file(\d+)/.exec(key)![1]);
    //                             if (files[fileId])
    //                             throw new Error(`Duplicate file id "${fileId}" found.`);
    //                         files[fileId]=obj[key] as File;
    //                         }
    //                         }
    //                         };  

    }
}