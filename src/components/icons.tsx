import type { JSX } from 'react'

type IconProps = {
  className?: string
}

// ---------------------------------------------------------------------------
// Weather icons (extracted from weather-widget for shared use)
// ---------------------------------------------------------------------------

export type WeatherIconType =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'fog'
  | 'haze'
  | 'unknown'

export function WeatherIcon({
  type,
  className = 'h-5 w-5',
}: IconProps & { type: WeatherIconType }) {
  switch (type) {
    case 'sunny':
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" fill="#F59E0B" r="4" />
          <g stroke="#F59E0B" strokeLinecap="round" strokeWidth="2">
            <line x1="12" x2="12" y1="2" y2="5" />
            <line x1="12" x2="12" y1="19" y2="22" />
            <line x1="2" x2="5" y1="12" y2="12" />
            <line x1="19" x2="22" y1="12" y2="12" />
            <line x1="4.93" x2="7.05" y1="4.93" y2="7.05" />
            <line x1="16.95" x2="19.07" y1="16.95" y2="19.07" />
            <line x1="4.93" x2="7.05" y1="19.07" y2="16.95" />
            <line x1="16.95" x2="19.07" y1="7.05" y2="4.93" />
          </g>
        </svg>
      )
    case 'partly-cloudy':
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="10" cy="10" fill="#F59E0B" r="3.5" />
          <g stroke="#F59E0B" strokeLinecap="round" strokeWidth="1.5">
            <line x1="10" x2="10" y1="3" y2="5" />
            <line x1="3" x2="5" y1="10" y2="10" />
            <line x1="5.22" x2="6.64" y1="5.22" y2="6.64" />
          </g>
          <path
            d="M9 18H17.5a3.5 3.5 0 000-7h-.3A4 4 0 009 14v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      )
    case 'cloudy':
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 19H17.5a4.5 4.5 0 000-9h-.5A5 5 0 006 14v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M4 19H13a3 3 0 000-6h-.5A3.5 3.5 0 004 16"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      )
    case 'rain':
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 14H17.5a4.5 4.5 0 000-9h-.5A5 5 0 006 9v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <g stroke="#60A5FA" strokeLinecap="round" strokeWidth="1.5">
            <line x1="8" x2="7" y1="17" y2="20" />
            <line x1="12" x2="11" y1="17" y2="20" />
            <line x1="16" x2="15" y1="17" y2="20" />
          </g>
        </svg>
      )
    case 'storm':
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 12H17.5a4.5 4.5 0 000-9h-.5A5 5 0 006 7v.5"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <polyline
            fill="none"
            points="13,14 10,19 13,19 10,24"
            stroke="#FCD34D"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      )
    case 'fog':
    case 'haze':
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <g stroke="#94A3B8" strokeLinecap="round" strokeWidth="1.5">
            <line x1="3" x2="21" y1="10" y2="10" />
            <line x1="5" x2="19" y1="14" y2="14" />
            <line x1="7" x2="17" y1="18" y2="18" />
          </g>
        </svg>
      )
    default:
      return (
        <svg
          aria-hidden="true"
          className={className}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="8" stroke="#94A3B8" strokeWidth="1.5" />
          <path
            d="M9 9a3 3 0 115.12 2.12C13.4 11.84 12 12.75 12 14"
            stroke="#94A3B8"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="17" fill="#94A3B8" r="0.75" />
        </svg>
      )
  }
}

// ---------------------------------------------------------------------------
// Service icons (replace DB emoji)
// ---------------------------------------------------------------------------

const serviceIconMap: Record<string, (p: IconProps) => JSX.Element> = {
  '🅿️': ParkingIcon,
  '🚿': ShowerIcon,
  '🚻': ToiletsIcon,
  '🦶': FootwashIcon,
  '⛱️': UmbrellaIcon,
  '🛏️': LoungerIcon,
  '🍹': BarIcon,
  '🩹': FirstAidIcon,
  '♿': AccessibleIcon,
}

export function ServiceIcon({
  emoji,
  className = 'h-4 w-4',
}: IconProps & { emoji: string }) {
  const Comp = serviceIconMap[emoji]
  if (Comp) return <Comp className={className} />
  return <span aria-hidden="true">{emoji}</span>
}

function ParkingIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="18" rx="3" stroke="currentColor" strokeWidth="1.5" width="18" x="3" y="3" />
      <path d="M9 16V8h4a3 3 0 010 6H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function ShowerIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 4h3a4 4 0 014 4v1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="11" cy="11" fill="currentColor" r="1.5" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
        <line x1="8" x2="7" y1="14" y2="18" />
        <line x1="11" x2="11" y1="14" y2="18" />
        <line x1="14" x2="15" y1="14" y2="18" />
      </g>
    </svg>
  )
}

function ToiletsIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="8" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8h4v4l-1 8H7l-1-8V8z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="17" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 8h4l-1 4h-2l-1-4z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M15.5 12l-.5 8M18.5 12l.5 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function FootwashIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 18c2-1 3-3 3-5V8l3-2v7c0 3 2 5 4 5h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
        <line x1="12" x2="11" y1="14" y2="17" />
        <line x1="9" x2="8" y1="13" y2="16" />
      </g>
    </svg>
  )
}

function UmbrellaIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3v18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12 3C6 3 3 8 3 12h18c0-4-3-9-9-9z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M10 21a2 2 0 01-2-2v-1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function LoungerIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M2 17l4-6h12l4 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M6 11V8a2 2 0 012-2h0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" x1="3" x2="5" y1="20" y2="17" />
      <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" x1="21" x2="19" y1="20" y2="17" />
    </svg>
  )
}

function BarIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M8 2l-4 9h12L12 2H8z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" x1="10" x2="10" y1="11" y2="19" />
      <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" x1="6" x2="14" y1="19" y2="19" />
      <circle cx="16" cy="6" r="1" fill="currentColor" />
      <path d="M17 4c2 0 3 1 3 3s-1 3-3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function FirstAidIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.5" width="16" x="4" y="4" />
      <line stroke="currentColor" strokeLinecap="round" strokeWidth="2" x1="12" x2="12" y1="8" y2="16" />
      <line stroke="currentColor" strokeLinecap="round" strokeWidth="2" x1="8" x2="16" y1="12" y2="12" />
    </svg>
  )
}

function AccessibleIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 22a5 5 0 110-10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12 9v4l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Activity icons (replace DB emoji)
// ---------------------------------------------------------------------------

const activityIconMap: Record<string, (p: IconProps) => JSX.Element> = {
  '🏊': SwimmingIcon,
  '🤿': SnorkelIcon,
  '🛶': KayakIcon,
  '🏄': SurfIcon,
  '🫧': DivingIcon,
  '🎣': FishingIcon,
  '⛵': SailingIcon,
  '🏄‍♂️': WindsurfIcon,
  '🪁': KitesurfIcon,
  '🏐': VolleyballIcon,
}

export function ActivityIcon({
  emoji,
  className = 'h-5 w-5',
}: IconProps & { emoji: string }) {
  const Comp = activityIconMap[emoji]
  if (Comp) return <Comp className={className} />
  return <span aria-hidden="true">{emoji}</span>
}

function SwimmingIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 9l-5-3-3 3 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M2 18c1.5-1.5 3-2 5-2s3.5.5 5 2c1.5-1.5 3-2 5-2s3.5.5 5 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function SnorkelIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M8 12a5 5 0 1110 0 5 5 0 01-10 0z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h5M18 12h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M18 7V4a1 1 0 011-1h0a1 1 0 011 1v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function KayakIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M2 14c3-4 17-4 20 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12 6v8M9 4l3 2 3-2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M2 18c1.5-1 3.5-1.5 5.5-1.5s4 .5 5.5 1.5c1.5-1 3.5-1.5 5.5-1.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function SurfIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9h6l-1 6H10l-1-6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M2 19c2-2 4-3 7-3s5 1 7 3c2-2 4-3 6-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function DivingIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="8" cy="18" fill="currentColor" r="1" />
      <circle cx="12" cy="20" fill="currentColor" r="1" />
      <circle cx="16" cy="18" fill="currentColor" r="1" />
    </svg>
  )
}

function FishingIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M18 2l-4 8h3l-4 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M14 18c0 2-2 4-4 4s-4-2-4-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="10" cy="17" fill="currentColor" r="1" />
    </svg>
  )
}

function SailingIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3v16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12 3L4 16h8" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M12 6l6 10h-6" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M2 20c3-2 6-3 10-3s7 1 10 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function WindsurfIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3v10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12 3L6 13h6" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M4 17c2-1 5-2 8-2s6 1 8 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M8 16l4-3 4 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function KitesurfIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 4c4-1 8 2 8 6S8 16 4 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M12 10l5 7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M14 19c2-1 4-1.5 6-1.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function VolleyballIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3c2 3 2 6 0 9s-2 6 0 9" stroke="currentColor" strokeWidth="1" />
      <path d="M3.5 8c3 1 6 1 8.5 0s5.5-1 8.5 0" stroke="currentColor" strokeWidth="1" />
      <path d="M3.5 16c3-1 6-1 8.5 0s5.5 1 8.5 0" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Collection theme icons (replace emoji in colecciones/index)
// ---------------------------------------------------------------------------

export const CollectionIcons: Record<string, (p: IconProps) => JSX.Element> = {
  'calas-escondidas': IslandIcon,
  'playas-familiares': FamilyIcon,
  'playas-para-perros': DogIcon,
  'playas-nudistas': SunIcon,
  'con-chiringuito': BarIcon,
  'bandera-azul': FlagIcon,
  snorkel: SnorkelIcon,
  'deportes-acuaticos': SurfIcon,
  'mejores-atardeceres': SunsetIcon,
  'playas-tranquilas': MeditationIcon,
  accesibles: AccessibleIcon,
  'playas-fotogenicas': CameraIcon,
}

export function CollectionIcon({
  slug,
  className = 'h-6 w-6',
}: IconProps & { slug: string }) {
  const Comp = CollectionIcons[slug] ?? BeachIcon
  return <Comp className={className} />
}

function IslandIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 6c-3 0-5 3-3 6l3-2 3 2c2-3 0-6-3-6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M12 10v8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M3 20c3-2 6-3 9-3s6 1 9 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function FamilyIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="8" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 11h6v3l-1 6H6l-1-6v-3zM13 11h6v3l-1 6h-4l-1-6v-3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="20" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 13h2v2l-.5 4h-1l-.5-4v-2z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1" />
    </svg>
  )
}

function DogIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 11c0-3 2-6 5-6h2l2-2 1 2h1c3 0 5 3 5 6v3c0 2-1 3-3 3h-1v3H7v-3H6c-2 0-3-1-3-3v-3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="9" cy="11" fill="currentColor" r="1" />
      <circle cx="15" cy="11" fill="currentColor" r="1" />
    </svg>
  )
}

function SunIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
        <line x1="12" x2="12" y1="2" y2="5" />
        <line x1="12" x2="12" y1="19" y2="22" />
        <line x1="2" x2="5" y1="12" y2="12" />
        <line x1="19" x2="22" y1="12" y2="12" />
        <line x1="4.93" x2="7.05" y1="4.93" y2="7.05" />
        <line x1="16.95" x2="19.07" y1="16.95" y2="19.07" />
        <line x1="4.93" x2="7.05" y1="19.07" y2="16.95" />
        <line x1="16.95" x2="19.07" y1="7.05" y2="4.93" />
      </g>
    </svg>
  )
}

function FlagIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 3v18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M4 3h12l-3 4 3 4H4" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function SunsetIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M5.64 7.64l1.41 1.41M18.36 7.64l-1.41 1.41" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M3 15h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M5 15a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 19c3-2 6-3 10-3s7 1 10 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function MeditationIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 20c0-3 1-5 4-5s4 2 4 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M6 16l3 1M18 16l-3 1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M9 11l3 2 3-2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function CameraIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function BeachIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3v9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M12 3c-4 0-7 4-5 9h10c2-5-1-9-5-9z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M2 20c3-2 6-3 10-3s7 1 10 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Certification icons (replace emoji in certifications-badge)
// ---------------------------------------------------------------------------

export function BlueFlagCertIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 3v18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M4 3h12l-3 4 3 4H4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

export function LeafIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M6 21c0-6 3-11 11-13C15 14 12 18 6 21z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M6 21c3-3 5-6 6-10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Misc icons used inline
// ---------------------------------------------------------------------------

export function BlueFlagBadgeIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 3v18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M4 3h12l-3 4 3 4H4" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}
