import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import { useCountUp } from "react-countup";
import { useRef } from "react";
import Card from "./Card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  format?: "number" | "currency";
  className?: string;
}

export default function StatsCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  format = "number",
  className,
}: StatsCardProps) {
  const displayPrefix = format === "currency" ? "EGP " : prefix;
  const decimals = format === "currency" ? 0 : 0;
  const countUpRef = useRef<HTMLElement>(null as any);

  useCountUp({
    ref: countUpRef,
    end: value,
    prefix: displayPrefix,
    suffix,
    decimals,
    duration: 1.5,
    separator: ",",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
            {icon}
          </div>
        </div>

        <p className="text-2xl font-bold text-navy mt-2">
          <span ref={countUpRef} />
        </p>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 mt-2 text-xs",
              trend.isPositive ? "text-green-600" : "text-red-600",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{Math.abs(trend.value)}% from last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
