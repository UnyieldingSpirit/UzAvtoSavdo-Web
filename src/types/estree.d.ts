/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'estree' {
    export interface Node {
        type: string;
        [key: string]: any;
    }

    export interface Program extends Node {
        body: Statement[];
        sourceType: 'script' | 'module';
    }

    export interface Statement extends Node { }
    export interface Expression extends Node { }
}