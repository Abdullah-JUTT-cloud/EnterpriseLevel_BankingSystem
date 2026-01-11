import Complaint from '../models/Complaint.js';

/**
 * @desc    Submit a complaint
 * @route   POST /api/complaints
 * @access  Private (Customer)
 */
export const submitComplaint = async (req, res) => {
    try {
        const { category, subject, description, priority } = req.body;

        const complaint = await Complaint.create({
            userId: req.user._id,
            category,
            subject,
            description,
            priority: priority || 'Medium',
            status: 'Open'
        });

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaint
        });
    } catch (error) {
        console.error('Complaint submission error:', error);
        res.status(500).json({
            message: 'Failed to submit complaint',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's complaints
 * @route   GET /api/complaints/my-complaints
 * @access  Private
 */
export const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id })
            .populate('assignedTo', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get complaints',
            error: error.message
        });
    }
};

/**
 * @desc    Get all complaints (Admin/Staff)
 * @route   GET /api/complaints/all
 * @access  Private (Admin/Staff)
 */
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('userId', 'fullName email cnic phone')
            .populate('assignedTo', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get complaints',
            error: error.message
        });
    }
};

/**
 * @desc    Update complaint status/resolution (Admin/Staff)
 * @route   PUT /api/complaints/:id
 * @access  Private (Admin/Staff)
 */
export const updateComplaint = async (req, res) => {
    try {
        const { status, resolution, priority } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (status) {
            complaint.status = status;
        }

        if (resolution) {
            complaint.resolution = resolution;
            if (status === 'Resolved' || status === 'Closed') {
                complaint.resolutionDate = new Date();
            }
        }

        if (priority) {
            complaint.priority = priority;
        }

        if (!complaint.assignedTo) {
            complaint.assignedTo = req.user._id;
        }

        await complaint.save();

        res.json({
            message: 'Complaint updated successfully',
            complaint
        });
    } catch (error) {
        console.error('Complaint update error:', error);
        res.status(500).json({
            message: 'Failed to update complaint',
            error: error.message
        });
    }
};
