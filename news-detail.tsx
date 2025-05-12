"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface NewsDetailProps {
  id: string
  title: string
  image: string
  content: string
  author: string
  date: string
  onClose: () => void
}

export default function NewsDetail({ id, title, image, content, author, date, onClose }: NewsDetailProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pequeño retraso para permitir la animación
    setTimeout(() => setIsVisible(true), 50)

    // Añadir listener para la tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={`news-modal-overlay ${isVisible ? "active" : ""}`} onClick={handleOverlayClick}>
      <div className="news-modal">
        <button className="news-modal-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <img src={image || "/placeholder.svg"} alt={title} className="news-modal-image" />

        <h2 className="news-modal-title">{title}</h2>

        <div className="news-modal-meta">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>

        <div className="news-modal-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}
