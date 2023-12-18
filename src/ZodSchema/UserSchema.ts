import { z } from "zod";

export const SignUpSchema = z.object({
    username:z.string().min(3, {
        message: "Username must be at least 3 characters"
    }),
    email:z.string().email().refine(value => !!value, {
        message: "Email is mandatory and should be a valid email address"
    }),
    password:z.string()
    .min(8, {message: "Password must be at least 8 characters"})
    .max(15, {message: "Password must not be more than 15 charaters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    }),
    confirmpassword:z.string()
    .min(8, {message: "Password must be at least 8 characters"})
    .max(15, {message: "Password must not be more than 15 charaters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    })
}).refine((data) => data.password === data.confirmpassword , {
    message:"Password did not match",
    path:["confirmpassword"]
})

export const PasswordSchema = z.object({
    password:z.string()
    .min(8, {message: "Password must be at least 8 characters"})
    .max(15, {message: "Password must not be more than 15 charaters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    }),
    newpassword:z.string()
    .min(8, {message: "Password must be at least 8 characters"})
    .max(15, {message: "Password must not be more than 15 charaters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    })
}).refine((data) => data.password === data.newpassword , {
    message:"Password did not match",
    path:["newpassword"]
})

export const SignInSchema = z.object({
    email:z.string().email().refine(value => !!value, {
        message: "Email is mandatory and should be a valid email address"
    }),
    password:z.string()
    .min(8, {message: "Password must be at least 8 characters"})
    .max(15, {message: "Password must not be more than 15 charaters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    })
})