import React from 'react';
import { Modal as RNModal, View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

export default function Modal({ visible, onRequestClose, children, contentStyle }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <Pressable>
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    minWidth: 260,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
});


