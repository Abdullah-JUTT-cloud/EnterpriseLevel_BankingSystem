/**
 * Status Badge Component
 * Displays colored status indicators
 */
const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'badge-pending';
            case 'approved':
            case 'active':
            case 'completed':
            case 'resolved':
            case 'generated':
                return 'badge-approved';
            case 'rejected':
            case 'failed':
            case 'closed':
                return 'badge-rejected';
            default:
                return 'badge-active';
        }
    };

    return (
        <span className={getStatusClass()}>
            {status}
        </span>
    );
};

export default StatusBadge;
