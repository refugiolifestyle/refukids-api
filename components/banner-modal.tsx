"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BannerModal() {
  const [banner, setBanner] = useState<any | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner`)
      .then(resp => resp.json())
      .then(({ banner }) => setBanner(banner))
  }, [])

  return <Dialog open={banner != null} onOpenChange={(open: any) => !open && setBanner(null)} modal={true}>
    <DialogContent className="w-full max-w-[1000px] aspect-video rounded border-none">
      {
        banner
          ? <Link href={banner?.link}>
            <img
              src={banner?.imagem}
              alt={`Banner inicial`}
              className="rounded" />
          </Link>
          : null
      }
    </DialogContent>
  </Dialog>
}
