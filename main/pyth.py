# Singly Linked List
class ListNode:
    def __init__(self,val):
        self.val = val
        self.next = None
class LinkedList:
    def __init__(self):
        self.head = ListNode(-1)
        self.tail = self.head

    def insertEnd(self,val):
        self.tail.next = ListNode(val)
        self.tail = self.tail.next

    def remove(self,index):
        i = 0
        curr = self.head
        while i < index and curr:
            i += 1
            curr = curr.next
        if curr:
            curr.next = curr.next.next

    def print(self):
        curr = self.head.next
        while curr:
            print(curr.val,"->")
            curr = curr.next

        print()


# Doubly Linked List
class ListNode:
    def __init__(self,val):
        self.val = val
        self.next = None
        self.prev = None

    
class LinkedList:
    def __init__(self):
        self.head = ListNode(-1)
        self.tail  = ListNode(-1)
        self.head.next = self.tail
        self.tail.prev = self.head

    

