import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, typography } from "../../theme"
import { Building, Users, FileText, AlertCircle } from "@/components/icons"

export function DashboardScreen() {
  const stats = [
    {
      title: "Total Properties",
      value: "12",
      change: "+2",
      icon: Building,
    },
    {
      title: "Active Tenants",
      value: "24",
      change: "+4",
      icon: Users,
    },
    {
      title: "Active Leases",
      value: "18",
      change: "+2",
      icon: FileText,
    },
    {
      title: "Pending Issues",
      value: "3",
      change: "-2",
      icon: AlertCircle,
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.7}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <stat.icon size={20} color={colors.muted} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statChange}>{stat.change} from last month</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>Activity content will go here</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Payments</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>Payments content will go here</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heading,
  },
  subtitle: {
    ...typography.body,
    color: colors.muted,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  statTitle: {
    ...typography.caption,
    color: colors.muted,
  },
  statValue: {
    ...typography.heading,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  statChange: {
    ...typography.caption,
    color: colors.muted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardText: {
    ...typography.body,
    color: colors.muted,
  },
})

