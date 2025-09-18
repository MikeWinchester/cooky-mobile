import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

interface BarcodeScannerProps {
  onBarcodeScanned: (data: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onBarcodeScanned, onClose }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'Código de barras escaneado',
      `Tipo: ${type}\nDatos: ${data}`,
      [
        {
          text: 'Cancelar',
          onPress: () => setScanned(false),
          style: 'cancel',
        },
        {
          text: 'Usar',
          onPress: () => {
            onBarcodeScanned(data);
            onClose();
          },
        },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No se tiene acceso a la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={30} color="#FFF8EC" />
        </TouchableOpacity>
        
        <View style={styles.scannerArea}>
          <View style={styles.scannerFrame} />
          <Text style={styles.instruction}>
            Apunta la cámara al código de barras del producto
          </Text>
        </View>
        
        <View style={styles.bottomInfo}>
          <Text style={styles.infoText}>
            El código de barras se escaneará automáticamente
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#FE6700',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instruction: {
    color: '#FFF8EC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bottomInfo: {
    alignItems: 'center',
  },
  infoText: {
    color: '#FFF8EC',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#FE6700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF8EC',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: '#FFF8EC',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
