import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const ResultDialog = ({ open, onClose, score, totalQuestions }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You scored {score} out of {totalQuestions} questions correctly.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResultDialog;