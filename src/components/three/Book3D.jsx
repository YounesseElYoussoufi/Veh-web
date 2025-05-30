import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, useTexture, Sparkles, Float } from '@react-three/drei'

function AnimatedBook() {
  const bookRef = useRef()
  const leftPageRef = useRef()
  const rightPageRef = useRef()
  const turningPageRef = useRef()
  const [pageAnimation, setPageAnimation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hovering, setHovering] = useState(false)

  // Création de plusieurs textures de pages différentes
  const pageTextures = useMemo(() => {
    return Array(8).fill(null).map((_, index) => {
      const texture = new THREE.CanvasTexture(createPageTexture(index))
      texture.needsUpdate = true
      return texture
    })
  }, [])

  useFrame((state) => {
    // Animation douce du livre avec effet de respiration
    if (bookRef.current) {
      // Livre posé horizontalement avec légère animation
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      bookRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
      
      // Effet de survol
      if (hovering) {
        bookRef.current.position.y += 0.2
      }
    }

    // Animation de tournage de page améliorée
    if (isAnimating && turningPageRef.current) {
      setPageAnimation((prev) => {
        const newVal = prev + 0.018
        if (newVal >= 1) {
          setIsAnimating(false)
          setCurrentPage((p) => (p + 1) % pageTextures.length)
          return 0
        }
        return newVal
      })
      
      // Rotation de la page avec effet de courbe réaliste
      const progress = pageAnimation
      turningPageRef.current.rotation.y = -progress * Math.PI * 0.98
      
      // Effet de courbure plus réaliste avec ondulation
      const curve = Math.sin(progress * Math.PI) * 0.4
      const wave = Math.sin(progress * Math.PI * 3) * 0.05
      turningPageRef.current.position.z = curve + wave
      turningPageRef.current.position.x = -0.7 + progress * 1.4
      
      // Légère inclinaison pendant le tournage
      turningPageRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.15
      turningPageRef.current.rotation.x = Math.sin(progress * Math.PI * 2) * 0.05
    }
  })

  useEffect(() => {
    // Animation de tournage automatique avec variation
    const interval = setInterval(() => {
      setIsAnimating(true)
    }, 4000 + Math.random() * 1000)
    
    return () => clearInterval(interval)
  }, [])

  function createPageTexture(pageIndex = 0) {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1536
    const ctx = canvas.getContext('2d')
    
    // Fond parchemin avec variation et motifs
    const gradient = ctx.createRadialGradient(1024, 768, 100, 1024, 768, 1200)
    const baseColors = [
      ['#fdfcf8', '#f9f3e4', '#f0e4c8'],
      ['#fffef5', '#f8f0dc', '#ede0c4'],
      ['#fcf8ed', '#f5ead8', '#e8dcc0'],
      ['#faf6e8', '#f2e6ca', '#e6d2a8'],
      ['#f8f4e6', '#f0e4c8', '#e4d0a4'],
      ['#fef9f0', '#f6ecd8', '#e8d8b8'],
      ['#fffdf8', '#f4e8d0', '#e6d4b0'],
      ['#fcf6e8', '#f0e2c6', '#e2cea2']
    ]
    const colors = baseColors[pageIndex % baseColors.length]
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.5, colors[1])
    gradient.addColorStop(1, colors[2])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2048, 1536)
    
    // Texture de papier vieilli avec fibres
    ctx.globalAlpha = 0.08
    for (let i = 0; i < 500; i++) {
      ctx.strokeStyle = `rgba(139, 69, 19, ${Math.random() * 0.1})`
      ctx.lineWidth = Math.random() * 0.5
      ctx.beginPath()
      ctx.moveTo(Math.random() * 2048, Math.random() * 1536)
      ctx.lineTo(Math.random() * 2048, Math.random() * 1536)
      ctx.stroke()
    }
    
    // Taches d'âge
    ctx.globalAlpha = 0.15
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 1536
      const radius = Math.random() * 50 + 20
      const brownShade = Math.floor(Math.random() * 50 + 100)
      
      const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      spotGradient.addColorStop(0, `rgba(${brownShade}, ${brownShade - 30}, ${brownShade - 60}, 0.3)`)
      spotGradient.addColorStop(1, `rgba(${brownShade}, ${brownShade - 30}, ${brownShade - 60}, 0)`)
      ctx.fillStyle = spotGradient
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
    
    // Bords usés et déchirés
    ctx.globalAlpha = 0.4
    ctx.strokeStyle = '#8b6f47'
    ctx.lineWidth = 3
    
    // Bord gauche
    ctx.beginPath()
    for (let i = 0; i < 1536; i += 10) {
      const offset = Math.sin(i * 0.01) * 15 + Math.random() * 5
      ctx.lineTo(offset, i)
    }
    ctx.stroke()
    
    // Bord droit
    ctx.beginPath()
    for (let i = 0; i < 1536; i += 10) {
      const offset = Math.sin(i * 0.01) * 15 + Math.random() * 5
      ctx.lineTo(2048 - offset, i)
    }
    ctx.stroke()
    
    // Contenu des pages selon l'index
    ctx.globalAlpha = 0.85
    ctx.fillStyle = '#2e1a0e'
    
    switch(pageIndex) {
      case 0:
        // Page de titre avec enluminure
        drawIlluminatedTitle(ctx)
        break
      case 1:
        // Introduction avec lettrine
        drawIntroductionPage(ctx)
        break
      case 2:
      case 3:
        // Pages de texte avec illustrations
        drawStoryPage(ctx, pageIndex)
        break
      case 4:
        // Page de carte
        drawMapPage(ctx)
        break
      case 5:
        // Page de choix
        drawChoicePage(ctx)
        break
      default:
        // Pages de texte standard
        drawTextPage(ctx, pageIndex)
    }
    
    // Bordure décorative pour toutes les pages
    drawDecorativeBorder(ctx)
    
    return canvas
  }

  function drawIlluminatedTitle(ctx) {
    // Grande lettrine enluminée
    ctx.save()
    ctx.font = 'bold 200px Georgia'
    ctx.fillStyle = '#8b4513'
    ctx.fillText('V', 200, 300)
    
    // Décoration autour de la lettrine
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(250, 250, 120, 0, Math.PI * 2)
    ctx.stroke()
    
    // Titre principal
    ctx.font = 'bold 72px Georgia'
    ctx.fillStyle = '#2e1a0e'
    ctx.fillText('otre Épopée Héroïque', 350, 280)
    
    // Sous-titre
    ctx.font = 'italic 36px Georgia'
    ctx.fillText('Une aventure dont vous êtes le héros', 300, 400)
    
    // Symboles mystiques
    const symbols = ['✦', '❋', '✧', '◆', '✦']
    ctx.font = '48px serif'
    ctx.fillStyle = '#d4af37'
    symbols.forEach((symbol, i) => {
      ctx.fillText(symbol, 400 + i * 150, 550)
    })
    
    ctx.restore()
  }

  function drawIntroductionPage(ctx) {
    // Lettrine
    ctx.save()
    ctx.font = 'bold 120px Georgia'
    ctx.fillStyle = '#8b4513'
    ctx.fillText('I', 150, 250)
    
    // Texte d'introduction
    ctx.font = '24px Georgia'
    ctx.fillStyle = '#2e1a0e'
    const introText = [
      "l était une fois, dans un royaume lointain où la magie",
      "dansait encore avec le vent et où les dragons dormaient",
      "dans les montagnes brumeuses, un livre mystérieux qui",
      "renfermait le pouvoir de changer le destin...",
      "",
      "Ce livre, que vous tenez maintenant entre vos mains,",
      "contient mille et une aventures. Chaque page tournée",
      "est un choix, chaque décision forge votre légende.",
      "",
      "Préparez-vous, brave aventurier, car votre épopée",
      "commence maintenant. Les terres d'Aethoria vous",
      "attendent, pleines de mystères et de merveilles..."
    ]
    
    let yPos = 200
    introText.forEach((line) => {
      ctx.fillText(line, 250, yPos)
      yPos += 40
    })
    
    ctx.restore()
  }

  function drawStoryPage(ctx, pageIndex) {
    // Illustration en haut de page
    ctx.save()
    ctx.fillStyle = '#d4af3730'
    ctx.fillRect(200, 100, 600, 300)
    ctx.strokeStyle = '#8b4513'
    ctx.lineWidth = 2
    ctx.strokeRect(200, 100, 600, 300)
    
    // Texte "Illustration"
    ctx.font = 'italic 24px Georgia'
    ctx.fillStyle = '#8b4513'
    ctx.fillText('[Illustration du héros face au dragon]', 300, 250)
    
    // Corps du texte
    ctx.font = '22px Georgia'
    ctx.fillStyle = '#2e1a0e'
    const storyText = [
      "Le chemin serpentait à travers la forêt sombre. Les arbres",
      "centenaires murmuraient des secrets oubliés tandis que",
      "vous avanciez prudemment, votre épée à la main.",
      "",
      "Soudain, un grondement sourd fit trembler le sol sous",
      "vos pieds. Dans la clairière devant vous, une silhouette",
      "massive se dressa, ses écailles brillant sous la lune..."
    ]
    
    let yPos = 480
    storyText.forEach((line) => {
      ctx.fillText(line, 200, yPos)
      yPos += 35
    })
    
    ctx.restore()
  }

  function drawMapPage(ctx) {
    // Titre de la carte
    ctx.font = 'bold 48px Georgia'
    ctx.fillStyle = '#2e1a0e'
    ctx.fillText('Carte d\'Aethoria', 750, 150)
    
    // Dessin simplifié de carte
    ctx.strokeStyle = '#8b4513'
    ctx.lineWidth = 2
    
    // Montagnes
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const x = 400 + i * 200
      const y = 300
      ctx.moveTo(x, y + 100)
      ctx.lineTo(x + 50, y)
      ctx.lineTo(x + 100, y + 100)
    }
    ctx.stroke()
    
    // Rivière
    ctx.beginPath()
    ctx.moveTo(300, 600)
    ctx.quadraticCurveTo(600, 500, 900, 600)
    ctx.quadraticCurveTo(1200, 700, 1500, 600)
    ctx.stroke()
    
    // Points d'intérêt
    const locations = [
      { name: 'Village de Départ', x: 400, y: 800 },
      { name: 'Forêt Mystique', x: 800, y: 600 },
      { name: 'Mont du Dragon', x: 1200, y: 400 },
      { name: 'Château du Roi', x: 1400, y: 800 }
    ]
    
    ctx.font = '20px Georgia'
    locations.forEach(loc => {
      ctx.beginPath()
      ctx.arc(loc.x, loc.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillText(loc.name, loc.x + 20, loc.y + 5)
    })
  }

  function drawChoicePage(ctx) {
    // Titre
    ctx.font = 'bold 48px Georgia'
    ctx.fillStyle = '#2e1a0e'
    ctx.fillText('Un Choix Crucial', 700, 200)
    
    // Texte de situation
    ctx.font = '24px Georgia'
    const situationText = [
      "Vous vous trouvez à la croisée des chemins. Trois routes",
      "s'offrent à vous, chacune menant vers un destin différent."
    ]
    
    let yPos = 300
    situationText.forEach((line) => {
      ctx.fillText(line, 400, yPos)
      yPos += 40
    })
    
    // Choix
    ctx.font = 'bold 28px Georgia'
    ctx.fillStyle = '#8b4513'
    
    const choices = [
      "➤ Prendre le chemin de gauche vers la forêt sombre (Page 47)",
      "➤ Continuer tout droit vers le château (Page 82)",
      "➤ Emprunter le sentier de droite vers les montagnes (Page 123)"
    ]
    
    yPos = 500
    choices.forEach((choice) => {
      ctx.fillText(choice, 400, yPos)
      yPos += 80
    })
  }

  function drawTextPage(ctx, pageIndex) {
    ctx.font = '22px Georgia'
    ctx.fillStyle = '#2e1a0e'
    
    const genericText = [
      "Les aventures continuent dans ce livre magique. Chaque",
      "page recèle de nouveaux mystères et de nouvelles épreuves.",
      "",
      "Votre courage sera mis à l'épreuve, votre sagesse testée,",
      "et vos choix détermineront l'issue de cette épopée.",
      "",
      "Que les dieux veillent sur votre quête..."
    ]
    
    let yPos = 300
    genericText.forEach((line) => {
      ctx.fillText(line, 300, yPos)
      yPos += 40
    })
  }

  function drawDecorativeBorder(ctx) {
    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.strokeStyle = '#8b4513'
    ctx.lineWidth = 4
    
    // Coins décoratifs
    const cornerSize = 100
    
    // Coin supérieur gauche
    ctx.beginPath()
    ctx.moveTo(50, 50 + cornerSize)
    ctx.lineTo(50, 50)
    ctx.lineTo(50 + cornerSize, 50)
    ctx.stroke()
    
    // Coin supérieur droit
    ctx.beginPath()
    ctx.moveTo(1998 - cornerSize, 50)
    ctx.lineTo(1998, 50)
    ctx.lineTo(1998, 50 + cornerSize)
    ctx.stroke()
    
    // Coin inférieur gauche
    ctx.beginPath()
    ctx.moveTo(50, 1486 - cornerSize)
    ctx.lineTo(50, 1486)
    ctx.lineTo(50 + cornerSize, 1486)
    ctx.stroke()
    
    // Coin inférieur droit
    ctx.beginPath()
    ctx.moveTo(1998 - cornerSize, 1486)
    ctx.lineTo(1998, 1486)
    ctx.lineTo(1998, 1486 - cornerSize)
    ctx.stroke()
    
    ctx.restore()
  }

  // Texture de couverture en cuir améliorée
  const coverTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 768
    const ctx = canvas.getContext('2d')
    
    // Fond cuir marron avec texture
    const gradient = ctx.createLinearGradient(0, 0, 1024, 768)
    gradient.addColorStop(0, '#6d4c41')
    gradient.addColorStop(0.3, '#5d4037')
    gradient.addColorStop(0.7, '#4e342e')
    gradient.addColorStop(1, '#3e2723')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 768)
    
    // Texture cuir détaillée
    ctx.globalAlpha = 0.4
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 768
      const size = Math.random() * 3
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`
      ctx.fillRect(x, y, size, size)
    }
    
    // Usure et patine
    ctx.globalAlpha = 0.2
    const wearGradient = ctx.createRadialGradient(512, 384, 100, 512, 384, 400)
    wearGradient.addColorStop(0, 'transparent')
    wearGradient.addColorStop(1, '#2e1a0e')
    ctx.fillStyle = wearGradient
    ctx.fillRect(0, 0, 1024, 768)
    
    // Titre principal avec effet doré
    ctx.globalAlpha = 1
    ctx.save()
    
    // Ombre du titre
    ctx.shadowColor = '#000'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 5
    ctx.shadowOffsetY = 5
    
    // Titre doré
    const titleGradient = ctx.createLinearGradient(0, 100, 0, 300)
    titleGradient.addColorStop(0, '#ffd700')
    titleGradient.addColorStop(0.5, '#ffed4e')
    titleGradient.addColorStop(1, '#d4af37')
    ctx.fillStyle = titleGradient
    ctx.font = 'bold 120px serif'
    ctx.textAlign = 'center'
    ctx.fillText('VEH', 512, 250)
    
    ctx.font = '48px serif'
    ctx.fillText('Votre Épopée', 512, 320)
    ctx.fillText('Héroïque', 512, 380)
    
    ctx.restore()
    
    // Ornements dorés complexes
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 4
    
    // Cadre principal
    ctx.strokeRect(80, 80, 864, 608)
    ctx.lineWidth = 2
    ctx.strokeRect(90, 90, 844, 588)
    
    // Motifs celtiques dans les coins
    drawCelticKnot(ctx, 150, 150, 50)
    drawCelticKnot(ctx, 874, 150, 50)
    drawCelticKnot(ctx, 150, 618, 50)
    drawCelticKnot(ctx, 874, 618, 50)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  function drawCelticKnot(ctx, x, y, size) {
    ctx.save()
    ctx.translate(x, y)
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    
    // Motif celtique simplifié
    ctx.beginPath()
    ctx.arc(0, 0, size, 0, Math.PI * 2)
    ctx.stroke()
    
    for (let i = 0; i < 4; i++) {
      ctx.save()
      ctx.rotate((Math.PI / 2) * i)
      ctx.beginPath()
      ctx.arc(size * 0.5, 0, size * 0.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    
    ctx.restore()
  }

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.2}
    >
      <group 
        ref={bookRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovering(true)}
        onPointerOut={() => setHovering(false)}
      >
        {/* Couverture du livre (dessous) */}
        <mesh position={[0, 0, -0.65]} castShadow>
          <boxGeometry args={[4, 5, 0.15]} />
          <meshStandardMaterial 
            map={coverTexture}
            roughness={0.8} 
            metalness={0.1}
            bumpScale={0.01}
          />
        </mesh>
        
        {/* Couverture du livre (dessus) */}
        <mesh position={[0, 0, 0.65]} castShadow>
          <boxGeometry args={[4, 5, 0.15]} />
          <meshStandardMaterial 
            color="#4e342e"
            roughness={0.9} 
            metalness={0.05}
          />
        </mesh>
        
        {/* Reliure avec détails */}
        <mesh position={[-2.1, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 5, 1.4]} />
          <meshStandardMaterial 
            color="#3e2314" 
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
        
        {/* Détails dorés sur la reliure */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-2.12, -2 + i * 1, 0]}>
            <boxGeometry args={[0.02, 0.1, 1.3]} />
            <meshStandardMaterial 
              color="#d4af37" 
              metalness={0.8}
              roughness={0.2}
              emissive="#d4af37"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
        
        {/* Pages du livre (volume) */}
        <mesh position={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[3.6, 4.8, 1.2]} />
          <meshStandardMaterial color="#f5e6d3" roughness={1} />
        </mesh>
        
        {/* Tranches des pages avec variation de couleur */}
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[2, (i - 10) * 0.24, 0]}>
            <planeGeometry args={[0.02, 1.2]} />
            <meshStandardMaterial 
              color={`hsl(40, 30%, ${85 - i * 0.5}%)`}
              roughness={1}
              metalness={0}
            />
          </mesh>
        ))}
        
        {/* Page gauche */}
        <mesh ref={leftPageRef} position={[-0.2, 0, 0.61]} rotation={[0, 0, 0]} castShadow>
          <planeGeometry args={[1.8, 4.6]} />
          <meshStandardMaterial 
            map={pageTextures[currentPage]} 
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
        
        {/* Page droite */}
        <mesh ref={rightPageRef} position={[1.6, 0, 0.61]} rotation={[0, 0, 0]} castShadow>
          <planeGeometry args={[1.8, 4.6]} />
          <meshStandardMaterial 
            map={pageTextures[(currentPage + 1) % pageTextures.length]} 
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
        
        {/* Page qui tourne */}
        <group ref={turningPageRef} position={[-0.2, 0, 0.62]}>
          <mesh castShadow>
            <planeGeometry args={[1.8, 4.6]} />
            <meshStandardMaterial 
              map={pageTextures[(currentPage + 2) % pageTextures.length]} 
              side={THREE.DoubleSide}
              roughness={0.9}
              transparent
              opacity={isAnimating ? 1 : 0}
            />
          </mesh>
        </group>
        
        {/* Marque-page */}
        <mesh position={[0.8, 2.3, 0.3]} rotation={[0, 0, 0.1]}>
          <planeGeometry args={[0.15, 1.5]} />
          <meshStandardMaterial 
            color="#8b0000"
            side={THREE.DoubleSide}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Composant pour les particules de poussière magique améliorées
function MagicalDust() {
  const pointsRef = useRef()
  const count = 500
  
  const [positions, colors, scales, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Position en forme de tourbillon autour du livre
      const angle = (i / count) * Math.PI * 2 * 5
      const radius = 1 + (i / count) * 4
      const height = (i / count) * 6 - 3
      
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1
      positions[i * 3 + 1] = height + (Math.random() - 0.5) * 0.5
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 1
      
      // Couleurs dorées et ambrées variées
      const color = new THREE.Color()
      const hue = 0.08 + Math.random() * 0.08
      const saturation = 0.7 + Math.random() * 0.3
      const lightness = 0.5 + Math.random() * 0.4
      color.setHSL(hue, saturation, lightness)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      scales[i] = Math.random() * 0.8 + 0.2
      
      // Vitesses individuelles
      velocities[i * 3] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 1] = Math.random() * 0.005 + 0.002
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    
    return [positions, colors, scales, velocities]
  }, [])
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      // Animation des particules avec mouvement tourbillonnant
      const positionArray = pointsRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Mouvement hélicoïdal ascendant
        const time = state.clock.elapsedTime
        const angle = time * 0.5 + (i / count) * Math.PI * 2
        const radius = 2 + Math.sin(time * 0.2 + i * 0.1) * 1
        
        positionArray[i3] = Math.cos(angle) * radius + velocities[i3] * time
        positionArray[i3 + 2] = Math.sin(angle) * radius + velocities[i3 + 2] * time
        
        // Mouvement vertical avec réinitialisation
        positionArray[i3 + 1] += velocities[i3 + 1]
        if (positionArray[i3 + 1] > 3) {
          positionArray[i3 + 1] = -3
        }
        
        // Mouvement ondulant subtil
        positionArray[i3] += Math.sin(time * 2 + i) * 0.001
        positionArray[i3 + 2] += Math.cos(time * 2 + i) * 0.001
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      
      // Pulsation de l'intensité générale
      pointsRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Lucioles magiques animées
function MagicalFireflies() {
  const firefliesRef = useRef([])
  const count = 20
  
  const firefliesData = useMemo(() => {
    return Array(count).fill(null).map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 3,
        (Math.random() - 0.5) * 10
      ],
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      radius: 2 + Math.random() * 2
    }))
  }, [])
  
  useFrame((state) => {
    firefliesRef.current.forEach((firefly, i) => {
      if (firefly) {
        const data = firefliesData[i]
        const time = state.clock.elapsedTime * data.speed
        
        // Mouvement en forme de 8
        firefly.position.x = data.position[0] + Math.sin(time + data.phase) * data.radius
        firefly.position.y = data.position[1] + Math.sin(time * 2 + data.phase) * 0.5
        firefly.position.z = data.position[2] + Math.cos(time + data.phase) * data.radius
        
        // Scintillement
        const intensity = 0.5 + Math.sin(time * 5 + data.phase) * 0.5
        firefly.material.emissiveIntensity = intensity
        firefly.scale.setScalar(0.1 + intensity * 0.1)
      }
    })
  })
  
  return (
    <group>
      {firefliesData.map((_, i) => (
        <mesh
          key={i}
          ref={el => firefliesRef.current[i] = el}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// Runes flottantes autour du livre
function FloatingRunes() {
  const runesRef = useRef()
  const runeSymbols = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ']
  
  useFrame((state) => {
    if (runesRef.current) {
      runesRef.current.rotation.y = state.clock.elapsedTime * 0.1
      
      runesRef.current.children.forEach((rune, i) => {
        rune.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.2
        rune.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1
      })
    }
  })
  
  return (
    <group ref={runesRef}>
      {runeSymbols.map((symbol, i) => {
        const angle = (i / runeSymbols.length) * Math.PI * 2
        const radius = 4
        
        return (
          <Float
            key={i}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <mesh
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
            >
              <planeGeometry args={[0.5, 0.5]} />
              <meshStandardMaterial
                color="#d4af37"
                emissive="#d4af37"
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function Book3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [6, 4, 8], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        shadows
      >
        {/* Éclairage atmosphérique complexe */}
        <ambientLight intensity={0.4} color="#f4e8d0" />
        
        {/* Lumière principale chaude */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          color="#ffd700"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Lumière de remplissage orange */}
        <pointLight 
          position={[-5, 5, -5]} 
          intensity={0.6} 
          color="#ff8c00"
          distance={20}
          decay={2}
        />
        
        {/* Lumière d'accentuation du bas */}
        <pointLight 
          position={[0, -5, 0]} 
          intensity={0.3} 
          color="#ffa500"
          distance={15}
        />
        
        {/* Spot sur le livre */}
        <spotLight
          position={[0, 8, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.8}
          color="#ffffff"
          castShadow
          target-position={[0, 0, 0]}
        />
        
        {/* Brouillard atmosphérique doré */}
        <fog attach="fog" args={['#1a0f0a', 10, 25]} />
        
        {/* Environnement HDR pour les reflets */}
        <Environment preset="sunset" />
        
        {/* Particules magiques tourbillonnantes */}
        <MagicalDust />
        
        {/* Lucioles magiques */}
        <MagicalFireflies />
        
        {/* Livre animé horizontal */}
        <AnimatedBook />
        
        {/* Runes flottantes */}
        <FloatingRunes />
        
        {/* Sparkles additionnels */}
        <Sparkles
          count={200}
          scale={10}
          size={2}
          speed={0.5}
          color="#ffd700"
        />
        
        {/* Sol avec ombre */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -2, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#1a0f0a"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Contrôles de caméra */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.3}
          target={[0, 0, 0]}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  )
}

export default Book3D