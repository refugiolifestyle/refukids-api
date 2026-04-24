"use client"

import LightGallery from 'lightgallery/react';

const fotosId = [
    "galeria/06ef83e2-f88a-4ec5-ba6f-dd6122b15449.jpeg",
    "galeria/097fdcc5-d977-43a1-bb74-0c6a0be674cd.jpeg",
    "galeria/0c68e7a2-1c3f-4085-8b9b-c4bad7224e54.jpeg",
    "galeria/0dfd8494-4d60-407f-9fd5-bc620a264abf.jpeg",
    "galeria/11b34048-c90e-43d4-b326-6d0ce08919e8.jpeg",
    "galeria/14f9b63c-9a29-4aed-a361-0816513b1636.jpeg",
    "galeria/1ba5a028-ae39-4508-90fc-b591d179f255.jpeg",
    "galeria/1c8fe05e-0268-439c-a414-65cbc19e7745.jpeg",
    "galeria/2361bdc4-12a9-453a-83d5-683ac9788191.jpeg",
    "galeria/2ba8142a-b208-4bf4-a51d-a5ee7e823652.jpeg",
    "galeria/2d4b09fb-811b-4c1b-8354-92cd249b6f49.jpeg",
    "galeria/373d5b2b-82f3-4049-8da6-f20afb9af32b.jpeg",
    "galeria/44b02c90-2333-4bc7-9de4-c27a062ee460.jpeg",
    "galeria/4b7499c7-b2f2-4882-82b7-2739e2c8aaa9.jpeg",
    "galeria/59c38acf-e667-4136-8986-f2ee09a8eaf4.jpeg",
    "galeria/5f830955-76e1-4fd9-96ed-3af012f03fb3.jpeg",
    "galeria/671f0f7d-2923-404e-ba9d-7630b8be8dcd.jpeg",
    "galeria/847a5e3d-0b45-49c9-bfb2-889b44df274d.jpeg",
    "galeria/84f34b3e-1734-4228-82a7-eb60f1d40ff2.jpeg",
    "galeria/85d98063-a2b1-41de-9647-a5bd436dac60.jpeg",
    "galeria/86bb0b75-e7ef-4fde-92a1-3c1d2e0a246e.jpeg",
    "galeria/8aaf7d3d-fa95-450d-8800-51a092cfe379.jpeg",
    "galeria/914b5d94-71b4-48e8-b2f7-d85a48ece787.jpeg",
    "galeria/9e061ae3-8696-44ad-9b01-2236736d8129.jpeg",
    "galeria/a7c90390-a3a3-4c83-8ebc-369dc6b40d40.jpeg",
    "galeria/a8fd9658-54d5-4cc8-9bca-c5fff7635663.jpeg",
    "galeria/ad4f5bdd-3ed3-48cd-887d-77c0c80eb2b3.jpeg",
    "galeria/b0a0b96c-47b3-4322-9e04-b7f16ee4049e.jpeg",
    "galeria/ce770714-3864-4f75-afe3-707c98df1170.jpeg",
    "galeria/cecb7758-153e-454a-b68c-ca59007808c6.jpeg",
    "galeria/d0ca6265-4112-49d9-a292-a5f3ec0fb038.jpeg",
    "galeria/d184a154-25b8-4ead-a319-c5d45a8a1328.jpeg",
    "galeria/db055c11-3572-4562-8b0a-38a90e54b729.jpeg",
    "galeria/dbd4a04f-28b1-4409-9d64-867527bf1fa8.jpeg",
    "galeria/df971c68-1935-4f20-b237-022c813e027a.jpeg",
    "galeria/dff9e7bb-e424-468e-bfa5-f7966a59a99c.jpeg",
    "galeria/f51c46a8-422a-4946-a615-e1be4f70caf5.jpeg",
    "galeria/f6a2d064-90b6-4860-a312-b9d912527f4c.jpeg",
    "galeria/f716ce5a-34d6-4807-9dd7-3a5c5fb1b4f8.jpeg",
    "galeria/f8a3df7f-ccce-4671-89fd-e01ae95bf77c.jpeg",
    "galeria/f8fecb82-2a34-4de4-bb94-04cbdba24bc3.jpeg",
    "galeria/f914f76e-c753-4220-b53a-fcfcfc0a6d00.jpeg",
    "galeria/f9273852-4a5b-498f-8864-61dcc07032c1.jpeg",
    "galeria/fa14a5e4-a42d-4c26-9496-8476805e85f0.jpeg",
    "galeria/fcbbd907-472e-4f7c-8ebd-62314c4e872f.jpeg"
]

export default function FooterGallery() {
    return <LightGallery
        speed={500}
        download={false}
        elementClassNames='grid grid-cols-3 gap-4 w-fit'>
        {
            fotosId.map((fotoId, i) => (
                <a className={`${i >= 6 ? 'hidden' : ''} size-24`} href={`${process.env.NEXT_PUBLIC_BASE_REFUFILES_URL}/${fotoId}`} key={fotoId}>
                    <img width={100} height={100} alt={`Refukids ${++i}`} src={`${process.env.NEXT_PUBLIC_BASE_REFUFILES_URL}/${fotoId}`} className='object-cover h-full w-full' />
                </a>
            ))
        }
    </LightGallery>
}