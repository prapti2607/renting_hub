"use client"

import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Button } from "../../components/ui/button"
import { TextInput } from "../../components/text-input"
import { useAuth } from "../../hooks/use-auth"
import { colors, spacing, typography } from "../../theme"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigation = useNavigation()
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      await login(email, password)
      navigation.navigate("Main")
    } catch (err) {
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your credentials to access your account</Text>
          </View>

          <View style={styles.form}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <Button title="Sign In" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerLink}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.sm,
  },
  registerLink: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  registerText: {
    ...typography.body,
    color: colors.muted,
  },
  registerTextBold: {
    fontWeight: "600",
    color: colors.primary,
  },
})

