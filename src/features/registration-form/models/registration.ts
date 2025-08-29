import * as yup from 'yup'
import { registrationSchema } from '../lib/ValidationSchema'

export type TRegistrationForm = yup.InferType<typeof registrationSchema>;