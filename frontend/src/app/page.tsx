import HeroSection from "@/components/ui/base/HeroSection";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(authOptions) ;
  console.log(session);
  
  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <HeroSection />
    </div>
  );
}


