package com.crossapplication.main.repository.impl;

import java.util.List;
import java.util.Optional;

import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

/**
 * Legacy, hand-written repository kept for reference. Made abstract so it
 * does not need to implement all methods from Spring Data's
 * `UserRepositoryInterface` (which extends `JpaRepository`).
 *
 * This class is intentionally not a Spring bean.
 */
public abstract class UserRepository implements UserRepositoryInterface{

    @PersistenceContext
    private EntityManager em;

    @Override
    public void deleteUser(Long id) {
        User user = em.find(User.class, id);
        if (user != null) {
            em.remove(user);
        }
    }

    @Override
    public List<User> findAllUser() {
        String jpql = "SELECT u FROM User u";
        return em.createQuery(jpql, User.class).getResultList();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String jpql = "SELECT u FROM User u WHERE u.email = :email";
        TypedQuery<User> query = em.createQuery(jpql, User.class);
        query.setParameter("email", email);

        List<User> result = query.getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(em.find(User.class, id));
    }

    @Override
    public <S extends User> S save(S user) {
        if (user.getId() == null) {
            em.persist(user);
            return user;
        } else {
            return em.merge(user);
        }
    }

    @Override
    public void updateUser(User user) {
        em.merge(user);
    }
}
