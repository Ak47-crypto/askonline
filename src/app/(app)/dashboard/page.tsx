'use client'
import {useState,useEffect,useCallback} from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input';
export default function dashboard() {
    const {register,watch}=useForm();
    const name=watch('last');
    console.log(name);
    
  return (
    <div>
        <form>
            <Input {...register('name')} />
            <Input {...register('last')} type='checkbox' />
        </form>
    </div>
  )
}
