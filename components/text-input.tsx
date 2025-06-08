"use client"

import { useState } from "react"
import { View, TextInput as RNTextInput, Text, StyleSheet, type TextInputProps as RNTextInputProps } from "react-native"
import { colors, spacing, typography } from "../../theme"

interface TextInputProps extends RNTextInputProps {
  label?: string
  error?: string
}

export function TextInput({ label, error, style, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, isFocused && styles.focused, error && styles.error, style]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: "500",
    color: colors.text,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    color: colors.text,
    ...typography.body,
  },
  focused: {
    borderColor: colors.primary,
  },
  error: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
})

