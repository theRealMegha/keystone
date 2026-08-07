package com.KeyStone.DeliveryService.service;

import com.KeyStone.DeliveryService.domain.Role;
import com.KeyStone.DeliveryService.domain.User;
import com.KeyStone.DeliveryService.domain.WorkOrderStatus;
import com.KeyStone.DeliveryService.dto.DashboardMetrics;
import com.KeyStone.DeliveryService.dto.UserResponse;
import com.KeyStone.DeliveryService.repository.PartRepository;
import com.KeyStone.DeliveryService.repository.UserRepository;
import com.KeyStone.DeliveryService.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final WorkOrderRepository workOrderRepository;
    private final PartRepository partRepository;
    private final UserRepository userRepository;

    public ReportService(WorkOrderRepository workOrderRepository,
                         PartRepository partRepository,
                         UserRepository userRepository) {
        this.workOrderRepository = workOrderRepository;
        this.partRepository = partRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetrics getDashboardMetrics() {
        long total = workOrderRepository.count();
        long newCount = workOrderRepository.countByStatus(WorkOrderStatus.NEW);
        long assigned = workOrderRepository.countByStatus(WorkOrderStatus.ASSIGNED);
        long inProgress = workOrderRepository.countByStatus(WorkOrderStatus.IN_PROGRESS);
        long onHold = workOrderRepository.countByStatus(WorkOrderStatus.ON_HOLD);
        long completed = workOrderRepository.countByStatus(WorkOrderStatus.COMPLETED);
        long closed = workOrderRepository.countByStatus(WorkOrderStatus.CLOSED);
        long cancelled = workOrderRepository.countByStatus(WorkOrderStatus.CANCELLED);
        long slaBreached = workOrderRepository.countSlaBreached(LocalDateTime.now());
        long lowStock = partRepository.findAll().stream()
                .filter(p -> p.getStockQty() <= p.getMinStockLevel())
                .count();

        long activeTotal = newCount + assigned + inProgress + onHold + completed + closed;
        double slaCompliance = activeTotal > 0 ? Math.max(0, ((double)(activeTotal - slaBreached) / activeTotal) * 100) : 100.0;

        return DashboardMetrics.builder()
                .totalWorkOrders(total)
                .newWorkOrders(newCount)
                .assignedWorkOrders(assigned)
                .inProgressWorkOrders(inProgress)
                .onHoldWorkOrders(onHold)
                .completedWorkOrders(completed)
                .closedWorkOrders(closed)
                .cancelledWorkOrders(cancelled)
                .slaBreachedCount(slaBreached)
                .lowStockPartsCount(lowStock)
                .slaComplianceRate(Math.round(slaCompliance * 10.0) / 10.0)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllTechnicians() {
        return userRepository.findByRole(Role.TECHNICIAN).stream()
                .map(this::mapUser)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUser)
                .collect(Collectors.toList());
    }

    private UserResponse mapUser(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(u.getRole())
                .phone(u.getPhone())
                .active(u.isActive())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
