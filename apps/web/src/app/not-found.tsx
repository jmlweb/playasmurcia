import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Página no encontrada</h2>
      <p>
        Ver <Link href="/lista-playas">Todas las playas</Link>
      </p>
    </div>
  );
}
