import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    id: bigint;
    name: string;
    timestamp: bigint;
    screenshotUrl: Option<string>;
}
export interface backendInterface {
    getSubmissions(password: string): Promise<Array<Submission>>;
    submitTradeReview(name: string, screenshotUrl: Option<string>): Promise<void>;
}
