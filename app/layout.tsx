import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Pausa MX | Compra sin arrepentirte', description: 'Una pausa antes de comprar: protege tu presupuesto y tu decisión.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body style={{margin:0,fontFamily:'Arial, sans-serif',background:'#f5f7fa',color:'#182b3a'}}>{children}</body></html>}
