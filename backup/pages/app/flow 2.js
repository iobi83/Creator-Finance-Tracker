import dynamic from 'next/dynamic';

const CreatorFlow = dynamic(() => import('../../components/CreatorFlow.jsx'), { ssr: false });

export default function FlowPage() {
  return <CreatorFlow />;
}
