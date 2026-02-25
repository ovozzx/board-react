'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  // 렌더링  후 useEffect 실행
  useEffect(() => { // 첫 렌더링 이후 무조건 한 번 실행 & 의존성 배열에 있는 값이 바뀌면 다시 실행
    router.push('/board/list'); // 현재 페이지 뒤에 새 기록을 추가하고 이동
    // Next.js가 내부적으로 app/board/list/page_bk.js 컴포넌트를 렌더링
    // Next.js가 정해둔 예약 파일명만 봄 (ex) page_bk.js : 실제 페이지

  }, [router]);

  return <div>Loading...</div>;
}
