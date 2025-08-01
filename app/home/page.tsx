'use client'
import { useState, useEffect } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'

export default function MapView() {
    const position = { lat: -29.2025, lng: 28.0337 }


    return (
        <APIProvider apiKey={"AIzaSyCyLvGP9ifUp9swhKHTzsmvrdazjpVleek"}>
            <Map
            style={{width: '100vw', height: '100vh'}}
            defaultCenter={position}
            defaultZoom={6}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            />
        </APIProvider>
    )
}