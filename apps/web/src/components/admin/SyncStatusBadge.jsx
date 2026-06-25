
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SyncStatusBadge = ({ status, lastSyncTime, isLoading, onSync }) => {
  let icon, colorClass, text;

  if (isLoading) {
    icon = <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />;
    colorClass = "bg-admin-primary/10 text-admin-primary border-admin-primary/20";
    text = "Syncing...";
  } else if (status === 'synced') {
    icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
    colorClass = "bg-admin-success/10 text-admin-success border-admin-success/20";
    text = "Synced";
  } else if (status === 'error') {
    icon = <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
    colorClass = "bg-admin-danger/10 text-admin-danger border-admin-danger/20";
    text = "Sync Failed";
  } else {
    icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
    colorClass = "bg-admin-muted text-admin-muted-foreground border-admin-border";
    text = "Not Synced";
  }

  const timeText = lastSyncTime 
    ? `Last sync ${formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}`
    : 'Never synced';

  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className={`${colorClass} px-2.5 py-0.5 cursor-pointer`} onClick={onSync}>
        {icon} {text}
      </Badge>
      <span className="text-xs text-admin-muted-foreground hidden sm:inline-block">
        {timeText}
      </span>
    </div>
  );
};

export default SyncStatusBadge;
