import { MoonLoader } from "react-spinners";
export default function LoaderScreen({ size }: { size: number }) {
  return (
    <div className='h-full'>
      <MoonLoader color='#579ee0' size={size} />
    </div>
  );
}
