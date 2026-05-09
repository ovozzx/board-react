'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from "@/components/common/Loading";
// src/app/ 폴더 = URL / (사이트 최상위)
export default function Home() {
  const router = useRouter();
  // 렌더링  후 useEffect 실행
  useEffect(() => { // 첫 렌더링 이후 무조건 한 번 실행 & 의존성 배열에 있는 값이 바뀌면 다시 실행
    router.push('/boards'); // 현재 페이지 뒤에 새 기록을 추가하고 이동
  }, [router]); // ESLint 규칙 -> effect 안에서 쓰는 외부 변수는 전부 의존성 배열에 넣어야 함

  return <Loading />; // useEffect 실행되기 전 동안 보여즘
}
