 
import Image from 'next/image';
import safety1 from '/public/video/ed5.jpg';
import { Montserrat } from 'next/font/google';
 
 

const roboto = Montserrat({
  subsets: ['latin'], 
  weight:['400','700'],
})


export default async function Home() {
	return ( 
		<>   
		<div className={roboto.className} style={{zIndex :-1, position: 'fixed', width: '100vw', height:'100vh'}} > 
    <Image alt="safety1" src = {safety1} layout='fill' style={{objectFit:'cover', filter:'blur(4px)'}}/> 
    </div>
    <section style={{display: 'grid', textAlign: 'center', backgroundClip:'border-box'}}>
    <div  className="max-w-5xl mx-auto py-16  rounded-lg shadow-lg p-8 z-10 text-white container ">
      <h2 className="text-5xl underline underline-offset-8 z-10 align-middle mt-56">For Business Enquiries :</h2>
      <p className="text-6xl py-4">Kinetics Data & Buslytics<span style={{fontSize:'38px'}}>  LLC</span></p>
      <p className="text-5xl ">Aamir Baig Mughal</p>
      <span style={{ marginLeft: '22em', display: 'block' }}><p className="text-xl">B.Appl Science( Engineering ), M.B.A( Business Analytics ), DMIT(CSD)</p></span> 
      <p className="text-5xl py-2">Edmonton - T6T 1A4</p>
      <p className="inline-flex text-3xl text-white">
            <svg
              className="w-14 h-10 text-gray-900"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4Zm12 12V5H7v11h10Zm-5 1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z"
                clip-rule="evenodd"
              />
            </svg>
            +1-587-990-6399
          </p>
          <p className=" inline-flex text-white text-3xl">
            <svg
              className="w-14 h-10 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
            </svg>
            +1-780-465-5595
          </p> 
      </div> 


    </section>
      
		</>
	);
}

 