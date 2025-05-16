'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AddressPicker = dynamic(() => import('../../components/AddressPicker'), { ssr: false });

// Regex to allow only letters and spaces
const nameRegex = /^[A-Za-z\s]+$/;

const schema = z.object({
  firstName: z
    .string()
    .min(2, 'First name is too short')
    .regex(nameRegex, 'First name must contain only letters'),
  lastName: z
    .string()
    .min(2, 'Last name is too short')
    .regex(nameRegex, 'Last name must contain only letters'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .regex(/^\d{10,}$/, 'Phone number must be at least 10 digits and contain only numbers'),
  address: z.string().min(5, 'Address is required'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [selectedAddress, setSelectedAddress] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log('Validated:', data);
  };

  return (
    <div className="p-6 w-[40%] mx-auto bg-white/40 backdrop-blur-md rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">User Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div>
          <input
            {...register('firstName')}
            placeholder="First Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <input
            {...register('lastName')}
            placeholder="Last Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            {...register('email')}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <input
            {...register('phone')}
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Address */}
        <div>
          <input
            {...register('address')}
            value={selectedAddress}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>

        <AddressPicker
          onSelect={(address: string) => {
            setSelectedAddress(address);
            setValue('address', address);
          }}
        />

        {/* Submit Button */}
        <div className="flex flex-col items-center space-y-4 mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Register
          </button>
          <a href="/login" className="text-blue-600 hover:underline text-sm">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
