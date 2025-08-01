'use client'
import { useState, useEffect } from 'react'

export default function MapView() {
    return (
            <gmp-map
                center="38.7946,-106.5348"
                zoom="4"
                map-id="DEMO_MAP_ID"
                className="h-screen"
                >
            </gmp-map>
    )
}