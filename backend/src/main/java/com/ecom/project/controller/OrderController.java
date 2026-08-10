package com.ecom.project.controller;


import com.ecom.project.payload.OrderDTO;
import com.ecom.project.payload.OrderRequestDTO;
import com.ecom.project.payload.OrderStatusUpdateRequest;
import com.ecom.project.service.OrderService;
import com.ecom.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod, @RequestBody OrderRequestDTO orderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()
        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/order/users")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser() {
        String emailId = authUtil.loggedInEmail();
        List<OrderDTO> orders = orderService.getOrdersByUser(emailId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderStatusUpdateRequest request) {
        OrderDTO order = orderService.updateOrderStatus(orderId, request.getStatus());
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/order/users/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.getOrderByIdForUser(emailId, orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
